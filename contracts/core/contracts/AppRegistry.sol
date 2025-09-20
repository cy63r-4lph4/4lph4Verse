// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * VerseAppRegistry (UUPS Upgradeable)
 *
 * - Registry of all Verse apps (HireCore, VaultOfLove, LeaseVault, etc.)
 * - Stores metadata, writer contract, score model contract, and weight in global score
 * - Governance controlled (ADMIN_ROLE can update/disable apps)
 * - Future proof: flexible weights, pluggable score models, upgradeable
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

interface IScoreModel {
    function scoreOf(uint256 verseId) external view returns (uint256);
}

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
    bytes32[] public appIds; // list of registered appIds

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

    // ---------- Admin ----------
    function registerApp(
        bytes32 appId,
        string calldata name,
        address writer,
        address scoreModel,
        uint16 weightBps
    ) external onlyRole(ADMIN_ROLE) {
        require(appId != 0, "bad appId");
        require(apps[appId].writer == address(0), "already exists");
        require(weightBps <= 10000, "invalid weight");

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

    function updateApp(
        bytes32 appId,
        address writer,
        address scoreModel,
        uint16 weightBps,
        bool active
    ) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        require(weightBps <= 10000, "invalid weight");

        App storage app = apps[appId];
        app.writer = writer;
        app.scoreModel = scoreModel;
        app.weightBps = weightBps;
        app.active = active;

        emit AppUpdated(appId, writer, scoreModel, weightBps, active);
    }

    function removeApp(bytes32 appId) external onlyRole(ADMIN_ROLE) {
        require(apps[appId].writer != address(0), "not exists");
        delete apps[appId];
        emit AppRemoved(appId);
        // Note: appIds[] not pruned for cheapness; frontend can filter by active flag
    }

    // ---------- Views ----------
    function getApp(bytes32 appId) external view returns (App memory) {
        return apps[appId];
    }

    function allAppIds() external view returns (bytes32[] memory) {
        return appIds;
    }

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
