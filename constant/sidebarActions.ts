/**
 * Sidebar Actions Configuration
 * Centralized data for Gooey Contact Sidebar
 * Ordered by conversion priority: Book → Call → WhatsApp → Email → Social
 */

export interface SidebarAction {
  id: string;
  label: string;
  ariaLabel: string;
  href: string;
  icon: string; // icon name from react-icons
  target?: "_blank" | "_self";
  rel?: string;
  disabled?: boolean;
  disabledReason?: string; // e.g., "Placeholder - to be updated"
}

/**
 * Contact phone number
 * Used for tel: and WhatsApp links
 */
export const PHONE_NUMBER = "0779631006";

/**
 * Calendly booking URL
 */
export const CALENDLY_URL = "https://calendly.com/ababnh21/30min";

/**
 * Primary contact email
 */
export const PRIMARY_EMAIL = "hi@maenababneh.dev";

/**
 * Sidebar actions in order of appearance
 * Desktop: vertical rail on left
 * Mobile: FAB at bottom-right, expands upward with Gooey effect
 */
export const SIDEBAR_ACTIONS: SidebarAction[] = [
  {
    id: "book-appointment",
    label: "Book Appointment",
    ariaLabel: "Book an appointment on Calendly",
    href: CALENDLY_URL,
    icon: "MdCalendarToday",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    id: "call",
    label: "Call Me",
    ariaLabel: `Call ${PHONE_NUMBER}`,
    href: `tel:${PHONE_NUMBER}`,
    icon: "MdCall",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    ariaLabel: `Send WhatsApp message to ${PHONE_NUMBER}`,
    href: `https://wa.me/${PHONE_NUMBER}`,
    icon: "FaWhatsapp",
    target: "_blank",
    rel: "noopener noreferrer",
    disabled: false,
  },
  {
    id: "email",
    label: "Email",
    ariaLabel: `Send email to ${PRIMARY_EMAIL}`,
    href: `mailto:${PRIMARY_EMAIL}`,
    icon: "MdEmail",
  },
  {
    id: "cv",
    label: "Download CV",
    ariaLabel: "Download CV (PDF)",
    href: "#",
    icon: "MdDownload",
    disabled: true,
    disabledReason: "Placeholder - CV link to be provided",
  },
  {
    id: "github",
    label: "GitHub",
    ariaLabel: "Visit GitHub profile",
    href: "https://github.com/MaenAbabneh",
    icon: "FaGithub",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    ariaLabel: "Visit LinkedIn profile",
    href: "https://www.linkedin.com/in/maenababneh/",
    icon: "FaLinkedin",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    id: "instagram",
    label: "Instagram",
    ariaLabel: "Visit Instagram profile",
    href: "https://www.instagram.com/maenababneh/",
    icon: "FaInstagram",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

/**
 * Get enabled actions (filter out disabled ones for regular rendering)
 */
export const getEnabledActions = (): SidebarAction[] => {
  return SIDEBAR_ACTIONS.filter((action) => !action.disabled);
};

/**
 * Get action by ID
 */
export const getActionById = (id: string): SidebarAction | undefined => {
  return SIDEBAR_ACTIONS.find((action) => action.id === id);
};
