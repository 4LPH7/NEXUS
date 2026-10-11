import { PRESETS, useSettingsStore } from '../../state/settingsStore'

/**
 * Scene lighting. Zone point lights sit near each section's backdrop so the
 * visitor literally travels between differently lit dimensions. All colors
 * follow the active theme preset.
 */
export function SceneLights() {
  const colors = useSettingsStore((s) => PRESETS[s.preset].colors)
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 10, 8]} intensity={1.1} color={colors.lightA} />

      {/* hero area */}
      <pointLight position={[3, 4, 6]} intensity={120} distance={30} decay={2} color={colors.accent} />
      {/* gallery void */}
      <pointLight position={[0, 2, -98]} intensity={260} distance={55} decay={2} color={colors.accent} />
      {/* playground void */}
      <pointLight position={[0, 1, -140]} intensity={220} distance={50} decay={2} color={colors.highlight} />
      {/* customization void */}
      <pointLight position={[0, 1, -166]} intensity={220} distance={50} decay={2} color={colors.accent2} />
      {/* manifesto void */}
      <pointLight position={[0, 0, -196]} intensity={180} distance={45} decay={2} color={colors.lightB} />
      {/* portal */}
      <pointLight position={[0, 0, -224]} intensity={300} distance={50} decay={2} color={colors.accent} />
    </>
  )
}
