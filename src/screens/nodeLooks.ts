import type { NodeState } from '../lib/path'

// How lesson and checkpoint nodes look on the path map and the CCNA tree.

export const NODE_LOOK: Record<NodeState, { className: string; edge: string }> = {
  done: { className: 'bg-matahari text-tinta', edge: 'var(--color-matahari-dalam)' },
  active: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  open: { className: 'bg-biru text-white', edge: 'var(--color-biru-dalam)' },
  locked: { className: 'bg-kabut text-tinta-lembut', edge: 'var(--color-kabut-dalam)' },
  soon: { className: 'bg-kabut text-tinta-lembut', edge: 'var(--color-kabut-dalam)' },
}

export const STATE_LABEL: Record<NodeState, string> = {
  done: 'selesai',
  active: 'lesson berikutnya',
  open: 'bisa dimainkan',
  locked: 'terkunci',
  soon: 'segera hadir',
}
