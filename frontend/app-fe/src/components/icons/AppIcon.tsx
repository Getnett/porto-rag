import {
  Bell,
  Bot,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  House,
  MessageSquareText,
  Settings,
  UploadCloud,
  type LucideIcon,
} from 'lucide-react'

const appIcons = {
  bell: Bell,
  bot: Bot,
  knowledgeBase: BookOpenText,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  conversations: MessageSquareText,
  ingestion: UploadCloud,
  overview: House,
  settings: Settings,

} satisfies Record<string, LucideIcon>

export type AppIconName = keyof typeof appIcons

type AppIconProps = {
  name: AppIconName
} & React.ComponentProps<LucideIcon>

export function AppIcon({ name, ...props }: AppIconProps) {
  const Icon = appIcons[name]

  return <Icon aria-hidden="true" {...props} />
}