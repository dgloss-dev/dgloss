export const iconMap = {
  RightArrow: () => import('react-icons/io').then((m) => ({ default: m.IoIosArrowForward })),
  UpArrow: () => import('react-icons/fa').then((m) => ({ default: m.FaArrowUp })),
  DownArrow: () => import('react-icons/fa').then((m) => ({ default: m.FaArrowDown })),
  LeftArrow: () => import('react-icons/fa').then((m) => ({ default: m.FaArrowLeft })),
  Add: () => import('react-icons/io').then((m) => ({ default: m.IoIosAdd })),
  Search: () => import('react-icons/ci').then((m) => ({ default: m.CiSearch })),
  Close: () => import('react-icons/io5').then((m) => ({ default: m.IoClose })),
  ChevronUp: () => import('react-icons/fa').then((m) => ({ default: m.FaChevronUp })),
  ChevronDown: () => import('react-icons/fa').then((m) => ({ default: m.FaChevronDown })),
  CheckMark: () => import('react-icons/io5').then((m) => ({ default: m.IoCheckmarkCircle })),
  Copy: () => import('react-icons/md').then((m) => ({ default: m.MdOutlineContentCopy })),
  Check: () => import('react-icons/fa').then((m) => ({ default: m.FaCheck })),
  Photo: () => import('react-icons/fa').then((m) => ({ default: m.FaRegImage })),
  Menu: () => import('react-icons/lu').then((m) => ({ default: m.LuMenu })),
  Square: () => import('react-icons/ri').then((m) => ({ default: m.RiCheckboxBlankFill })),
  Edit: () => import('react-icons/bi').then((m) => ({ default: m.BiSolidEditAlt })),
  CircleCheck: () => import('react-icons/fa').then((m) => ({ default: m.FaRegCheckCircle })),
  Prohibited: () => import('react-icons/pi').then((m) => ({ default: m.PiProhibitBold })),
  Seated: () => import('react-icons/pi').then((m) => ({ default: m.PiOfficeChairFill })),
  Delete: () => import('react-icons/fa').then((m) => ({ default: m.FaTrash })),
  InformationCircle: () => import('react-icons/hi').then((m) => ({ default: m.HiInformationCircle })),
  CheckCircle: () => import('react-icons/hi').then((m) => ({ default: m.HiCheckCircle })),
  XCircle: () => import('react-icons/hi').then((m) => ({ default: m.HiXCircle })),
};
