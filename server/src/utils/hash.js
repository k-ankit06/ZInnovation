import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';

function normalizePhone(p) { return (p || '').replace(/\D/g, ''); }
function clean(s) { return (s || '').toString().trim(); }

export function canonicalizeTourist(input, existingNonce) {
  const payload = {
    name: clean(input.fullName || input.name),
    email: clean((input.email || '').toLowerCase()),
    phone: normalizePhone(input.phone),
    touristType: clean((input.touristType || '').toLowerCase()),
    country: clean((input.country || '').toUpperCase()),
    idNumber: clean(input.passportNumber || input.aadhaarNumber),
    dateOfBirth: clean(input.dateOfBirth || ''),
    nonce: existingNonce || uuid()
  };
  const normalized = `${payload.name}|${payload.email}|${payload.phone}|${payload.touristType}|${payload.country}|${payload.idNumber}|${payload.dateOfBirth}|${payload.nonce}`;
  const idHash = ethers.keccak256(ethers.toUtf8Bytes(normalized));
  return { canonical: payload, idHash };
}