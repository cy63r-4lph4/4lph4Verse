import { PinataSDK } from "pinata";

console.log("PINATA_JWT:", process.env.PINATA_JWT);
export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});
