// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VerseAppRegistry
 * @notice Registry of all Verse apps (HireCore, VaultOfLove, LeaseVault, etc.)
 *
 * @dev
 * - UUPS Upgradeable, AccessControl-administered.
 * - Stores metadata, writer contract, score model contract, and weight in global score.
 * - Governance controlled (ADMIN_ROLE can add/update/disable apps).
 * - Future-proof: flexible weights, pluggable score models, upgradeable with storage gap.
 *
 * Typical consumers:
 * - ReputationHub: checks {active, writer} for a given appId to authorize writes; reads scoreModel.
 * - ScoreAggregator: iterates appIds, reads {active, weightBps, scoreModel} for weighted scoring.
 */

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@verse/contracts/interfaces/IVerseAppRegistry.sol";
import "@verse/contracts/interfaces/IScoreModel.sol";

contract VerseAppRegistry is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    // ---------- Roles ----------
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // ---------- Types ----------
    struct App {
        string name; // human-readable name ("HireCore")
        address writer; // contract allowed to write metrics in ReputationHub
        address scoreModel; // contract implementing IScoreModel
        uint16 weightBps; // weighting in global score (0-10000)
        bool active; // app enabled/disabled
    }

    // ---------- Storage ----------
    mapping(bytes32 => App) private apps; // appId => App
    bytes32[] public appIds; // list of registered appIds (not pruned)

    // ---------- Events ----------
    event AppRegistered(
        bytes32 indexed appId,
        string name,
        address writer,
        address scoreModel,
        uint16 weightBps
    );
    event AppUpdated(
        bytes32 indexed appId,
        address writer,
        address scoreModel,
        uint16 weightBps,
        bool active
    );
    event AppRemoved(bytes32 indexed appId);
    event AppNameUpdated(bytes32 indexed appId, string newName);
    event AppWriterUpdated(bytes32 indexed appId, address writer);
    event AppScoreModelUpdated(bytes32 indexed appId, address scoreModel);
    event AppWeightUpdated(bytes32 indexed appId, uint16 weightBps);
    event AppActiveUpdated(bytes32 indexed appId, bool active);

    // ---------- Constructor (upgrade-safe) ----------
    constructor() {
        _disableInitializers();
    }

    // ---------- Init ----------
    function initialize(address admin) external initializer {
        require(admin != address(0), "bad admin");
        __UUPSUpgradeable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(
        address
    ) internal override onlyRole(ADMIN_ROLE) {}

    // ---------- Admin: Create / Update / Remove ----------
    /**
     * @notice Register a new appId with its config.
     */
    function registerApp(
        bytes32 appId,
        string calldata name,
        address writer,
        address scoreModel,
        uint16 weightBps
    ) external onlyRole(ADMIN_ROLE) {
        require(appId != 0, "bad appId");
        require(apps[appId].writer == address(0), "already exists");
        require(weightBps <= 10_000, "invalid weight");

        apps[appId] = App({
            name: name,
            writer: writer,
            scoreModel: scoreModel,
            weightBps: weightBps,
            active: true
        });
        appIds.push(appId);

        emit AppRegistered(appId, name, writer, scoreModel, weightBps);
    }

    /**
     * @notice Bulk update (kept for convenience). Prefer granular setters to avoid accidental overwrites.
     */
    function updateApp(
        bytes32 appId,
        address writer,
        address scoreModel,
        uint16 weightBps,
        bool active
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        require(weightBps <= 10_000, "invalid weight");

        App storage app = apps[appId];
        app.writer = writer;
        app.scoreModel = scoreModel;
        app.weightBps = weightBps;
        app.active = active;

        emit AppUpdated(appId, writer, scoreModel, weightBps, active);
    }

    /**
     * @notice Remove app from mapping (appIds array is not pruned for gas reasons).
     */
    function removeApp(bytes32 appId) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        delete apps[appId];
        emit AppRemoved(appId);
    }

    // ---------- Admin: Granular setters (safer upgrades) ----------
    function setAppName(
        bytes32 appId,
        string calldata newName
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        apps[appId].name = newName;
        emit AppNameUpdated(appId, newName);
    }

    function setAppWriter(
        bytes32 appId,
        address writer
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        apps[appId].writer = writer;
        emit AppWriterUpdated(appId, writer);
    }

    function setAppScoreModel(
        bytes32 appId,
        address scoreModel
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        apps[appId].scoreModel = scoreModel;
        emit AppScoreModelUpdated(appId, scoreModel);
    }

    function setAppWeight(
        bytes32 appId,
        uint16 weightBps
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        require(weightBps <= 10_000, "invalid weight");
        apps[appId].weightBps = weightBps;
        emit AppWeightUpdated(appId, weightBps);
    }

    function setAppActive(
        bytes32 appId,
        bool active
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        apps[appId].active = active;
        emit AppActiveUpdated(appId, active);
    }

    // ---------- Views (wiring helpers) ----------
    function getApp(bytes32 appId) external view returns (App memory) {
        return apps[appId];
    }

    function allAppIds() external view returns (bytes32[] memory) {
        return appIds;
    }

    /// @notice Lightweight read for aggregators.
    function appConfigOf(
        bytes32 appId
    )
        external
        view
        returns (
            address writer,
            address scoreModel,
            uint16 weightBps,
            bool active
        )
    {
        App storage a = apps[appId];
        return (a.writer, a.scoreModel, a.weightBps, a.active);
    }

    /// @notice True if app exists and is active.
    function isActive(bytes32 appId) external view returns (bool) {
        return apps[appId].writer != address(0) && apps[appId].active;
    }

    /// @notice True if `candidate` is the registered writer for `appId`.
    function isWriter(
        bytes32 appId,
        address candidate
    ) external view returns (bool) {
        return apps[appId].writer == candidate && apps[appId].active;
    }

    /// @notice Score + weight for a single app (0 if inactive or no model).
    function computeAppScore(
        bytes32 appId,
        uint256 verseId
    ) external view returns (uint256 rawScore, uint16 weightBps) {
        App storage app = apps[appId];
        if (!app.active || app.scoreModel == address(0)) return (0, 0);
        rawScore = IScoreModel(app.scoreModel).scoreOf(verseId);
        weightBps = app.weightBps;
    }

    // ---------- Storage gap ----------
    uint256[45] private __gap;
}
