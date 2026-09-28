export type RoleId = 1 | 2 | 3 | 4 | 5 | null;

export const NORMALIZED_ROLES = {
  CLIENT: 'Cliente',
  COLABORADOR: 'Colaborador',
  LIDER: 'Líder',
  ADMIN: 'Admin',
  COORDINADOR: 'Coordinador',
  EJECUTIVO: 'Ejecutivo de Comunicación'
} as const;

export type NormalizedRole = typeof NORMALIZED_ROLES[keyof typeof NORMALIZED_ROLES];

export function getNormalizedRole(roleId: number | string | null | undefined): NormalizedRole {
  const id = roleId === null || roleId === undefined ? null : Number(roleId);
  switch (id) {
    case 1: return NORMALIZED_ROLES.COLABORADOR;
    case 2: return NORMALIZED_ROLES.LIDER;
    case 3: return NORMALIZED_ROLES.ADMIN;
    case 4: return NORMALIZED_ROLES.COORDINADOR;
    case 5: return NORMALIZED_ROLES.EJECUTIVO;
    default: return NORMALIZED_ROLES.CLIENT;
  }
}
