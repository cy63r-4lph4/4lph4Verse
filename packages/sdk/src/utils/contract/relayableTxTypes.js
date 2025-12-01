/**
 * Auto-generated Relayable Tx Types
 * Derived from proxy contracts (...WithSig functions)
 * Do not edit manually.
 */
export const RelayableTxTypes = {
    CoreFaucet: {
        claimWithSig: {
            primaryType: "ClaimWithSig",
            inputs: [
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "nonce",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256",
                },
                {
                    internalType: "bytes",
                    name: "signature",
                    type: "bytes",
                },
            ],
            types: {
                ClaimWithSig: [
                    {
                        name: "to",
                        type: "address",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
    },
    VerseProfile: {
        createProfileWithSig: {
            primaryType: "CreateProfileWithSig",
            inputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "string",
                            name: "handle",
                            type: "string",
                        },
                        {
                            internalType: "string",
                            name: "metadataURI",
                            type: "string",
                        },
                        {
                            internalType: "string",
                            name: "purpose",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct VerseProfile.CreateProfileWithSig",
                    name: "op",
                    type: "tuple",
                },
                {
                    internalType: "bytes",
                    name: "sig",
                    type: "bytes",
                },
            ],
            types: {
                CreateProfileWithSig: [
                    {
                        name: "owner",
                        type: "address",
                    },
                    {
                        name: "handle",
                        type: "string",
                    },
                    {
                        name: "metadataURI",
                        type: "string",
                    },
                    {
                        name: "purpose",
                        type: "string",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
        setDelegateWithSig: {
            primaryType: "SetDelegateWithSig",
            inputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "verseId",
                            type: "uint256",
                        },
                        {
                            internalType: "address",
                            name: "newDelegate",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct VerseProfile.SetDelegateWithSig",
                    name: "op",
                    type: "tuple",
                },
                {
                    internalType: "bytes",
                    name: "sig",
                    type: "bytes",
                },
            ],
            types: {
                SetDelegateWithSig: [
                    {
                        name: "verseId",
                        type: "uint256",
                    },
                    {
                        name: "newDelegate",
                        type: "address",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
        setHandleWithSig: {
            primaryType: "SetHandleWithSig",
            inputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "verseId",
                            type: "uint256",
                        },
                        {
                            internalType: "string",
                            name: "newHandle",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct VerseProfile.SetHandleWithSig",
                    name: "op",
                    type: "tuple",
                },
                {
                    internalType: "bytes",
                    name: "sig",
                    type: "bytes",
                },
            ],
            types: {
                SetHandleWithSig: [
                    {
                        name: "verseId",
                        type: "uint256",
                    },
                    {
                        name: "newHandle",
                        type: "string",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
        setMetadataWithSig: {
            primaryType: "SetMetadataWithSig",
            inputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "verseId",
                            type: "uint256",
                        },
                        {
                            internalType: "string",
                            name: "newURI",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct VerseProfile.SetURIWithSig",
                    name: "op",
                    type: "tuple",
                },
                {
                    internalType: "bytes",
                    name: "sig",
                    type: "bytes",
                },
            ],
            types: {
                SetMetadataWithSig: [
                    {
                        name: "verseId",
                        type: "uint256",
                    },
                    {
                        name: "newURI",
                        type: "string",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
        setPurposeWithSig: {
            primaryType: "SetPurposeWithSig",
            inputs: [
                {
                    components: [
                        {
                            internalType: "uint256",
                            name: "verseId",
                            type: "uint256",
                        },
                        {
                            internalType: "string",
                            name: "newPurpose",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct VerseProfile.SetPurposeWithSig",
                    name: "op",
                    type: "tuple",
                },
                {
                    internalType: "bytes",
                    name: "sig",
                    type: "bytes",
                },
            ],
            types: {
                SetPurposeWithSig: [
                    {
                        name: "verseId",
                        type: "uint256",
                    },
                    {
                        name: "newPurpose",
                        type: "string",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
        },
    },
};
