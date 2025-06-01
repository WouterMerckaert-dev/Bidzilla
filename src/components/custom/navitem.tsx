import {FunctionComponent} from 'react'
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip'
import Link from 'next/link'
import {LucideIcon} from 'lucide-react'

interface NavItemProps {
  isCollapsed: boolean
  Icon: LucideIcon
  title: string
  path: string
}

const NavItem: FunctionComponent<NavItemProps> = ({isCollapsed, Icon, title, path}) => {
  const collapsedLink = (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={path}
          className="flex justify-center p-2 rounded dark:hover:bg-muted dark:hover:text-muted-foreground">
          <Icon size={24} />
          <span className="sr-only">{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {title}
      </TooltipContent>
    </Tooltip>
  )

  const fullLink = (
    <Link
      href={path}
      className="flex mx-2 items-center p-2 rounded dark:hover:bg-muted dark:hover:text-muted-foreground">
      <Icon className="mr-2 min-w-4" size={24} />
      <div className="overflow-hidden truncate w-full">{title}</div>
    </Link>
  )

  return <div className="text">{isCollapsed ? collapsedLink : fullLink}</div>
}

export default NavItem
