// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IJobManager
/// @notice Minimal external interface for the HireCoreJobManager.
/// @dev Keep this in sync with JobManager implementation and JobBoard usage.
interface IJobManager {
    // ---------- Types ----------
    enum JobStatus {
        Created,
        Funded,
        InProgress,
        Disputed,
        Completed,
        Released,
        Cancelled
    }

    enum JobType {
        Simple,
        Milestone,
        Streaming
    }

    struct Milestone {
        uint256 amount;
        uint64 dueDate;
        bool delivered;
        bool released;
        bool requiresDeliverable;
        string deliverableURI;
        string note;
    }

    struct CreateJobParams {
        address worker;
        address paymentToken;    // address(0) = native
        uint64 deadline;         // unix ts
        string metadataURI;      // offchain JSON
        JobType jobType;         // Simple | Milestone (Streaming reserved)
        uint256[] amounts;       // milestone amounts (len > 0; =1 for Simple)
        uint64[] dueDates;       // per-milestone due date
        bool[] requiresDeliverable; // per-milestone flag
    }

    struct JobCore {
        address hirer;
        address worker;
        address paymentToken;
        uint256 totalAmount;
        uint256 fundedAmount;
        uint16 feeBpsAtCreation;
        JobStatus status;
        JobType jobType;
        uint64 createdAt;
        uint64 deadline;
        string metadataURI;
        uint256 milestonesCount;
    }

    // ---------- Events ----------
    event JobCreated(
        uint256 indexed jobId,
        address indexed hirer,
        address indexed worker,
        JobType jobType,
        address paymentToken,
        uint256 totalAmount,
        uint16 feeBps
    );

    event JobFunded(
        uint256 indexed jobId,
        address indexed from,
        uint256 amount,
        uint256 fundedTotal
    );

    event MetadataURIUpdated(uint256 indexed jobId, string newURI);

    event MilestoneDelivered(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        string deliverableURI,
        string note
    );

    event MilestoneReleased(
        uint256 indexed jobId,
        uint256 indexed milestoneIndex,
        uint256 netToWorker,
        uint256 feeToTreasury
    );

    event JobDisputed(uint256 indexed jobId, string reason);

    event JobResolved(
        uint256 indexed jobId,
        uint256 workerPayout,
        uint256 hirerRefund,
        uint256 feeTaken
    );

    event JobCancelled(uint256 indexed jobId, uint256 refund);

    // ---------- External: Job lifecycle ----------
    function createJob(CreateJobParams calldata params)
        external
        returns (uint256 jobId);

    function updateJobMetadataURI(uint256 jobId, string calldata newURI) external;

    function fundJob(uint256 jobId, uint256 amount) external;

    function fundJobWithPermit(
        uint256 jobId,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function fundJobNative(uint256 jobId) external payable;

    function deliverMilestone(
        uint256 jobId,
        uint256 milestoneIndex,
        string calldata deliverableURI,
        string calldata note
    ) external;

    function releaseMilestone(uint256 jobId, uint256 milestoneIndex) external;

    function disputeJob(uint256 jobId, string calldata reason) external;

    function resolveDispute(
        uint256 jobId,
        uint256 workerPayout,
        uint256 hirerRefund
    ) external;

    function cancelJob(uint256 jobId) external;

    // ---------- External: Views ----------
    function getJobCore(uint256 jobId) external view returns (JobCore memory);

    function getMilestone(uint256 jobId, uint256 index)
        external
        view
        returns (Milestone memory);
}
