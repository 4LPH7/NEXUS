// Centralized site content and navigation targets.
export interface NavItem {
  label: string
  sectionId: string
}

export const SITE = {
  name: 'NEXUS',
  version: 'VOL. 001',
  tagline: 'Enter a different dimension.',
  description:
    'A playground where motion becomes interaction, objects respond to curiosity, and the boundaries between websites and digital worlds disappear.',
  nav: [
    { label: 'Explore', sectionId: 'descend' },
    { label: 'Experiments', sectionId: 'objects' },
    { label: 'About', sectionId: 'manifesto' },
  ] satisfies NavItem[],
  footerNote: 'Built with React Three Fiber, Motion, and curiosity.',
  year: new Date().getFullYear(),
} as const

export const SECTION_IDS = [
  'hero',
  'descend',
  'objects',
  'playground',
  'customization',
  'manifesto',
  'final',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
