export type NavbarItem = {
  label: string;
  href?: string;
  icon?: React.ElementType;
  onClick?: () => void;
};

export type NavbarTheme = {
  backdrop?: string;
  border?: string;
  logoStyle?: string;
  linkStyle?: string;
  hoverStyle?: string;
  gradientText?: boolean;
  menuButtonStyle?: string;
};
