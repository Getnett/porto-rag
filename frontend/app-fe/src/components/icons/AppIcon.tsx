import {
  type LucideIcon,
} from 'lucide-react'

import * as LucideIcons from 'lucide-react'
export type LucideIconName = keyof typeof LucideIcons

type AppIconProps = {
  name: LucideIconName
} & React.ComponentProps<LucideIcon>

export function AppIcon({ name, ...props }: AppIconProps) {
   	const IconComponent = LucideIcons[name as LucideIconName] as
		| LucideIcon
		| undefined;

    if(!IconComponent) {
      console.warn(`Icon "${name}" not found in LucideIcons.`)
      return null
    }

  return <IconComponent {...props}  />
}
