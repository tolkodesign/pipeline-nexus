import { NORMALIZED_ROLES } from './identity';

export function canManagePressDirectory(profile: any): boolean {
  if (!profile) return false;

  // Admin access
  if (profile.normalized_role === NORMALIZED_ROLES.ADMIN) return true;

  // PR / Relaciones Públicas access
  // Checking both specialties object and fallback specialty string for backward compatibility
  const specialtyName = (profile.specialties?.name || profile.specialty || '').toLowerCase();
  
  return specialtyName.includes('relaciones') || specialtyName.includes('rp');
}
