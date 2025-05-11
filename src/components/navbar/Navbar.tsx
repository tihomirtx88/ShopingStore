import Container from "../global/Container";
import CartButton from "./CartButton";
import DarkMode from "./DarkMode";
import LinksDropdown from "./LinksDropdown";
import Logo from "./Logo";
import NavSEarch from "./NavSEarch";

export default function Navbar() {
  return (
    <nav className="border-b">
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-centre flex-wrap gap-4 py-8">
        <Logo/>
        <NavSEarch/>
        <div className="flex gap-4 items-center">
          <CartButton/>
          <DarkMode/>
          <LinksDropdown/>
        </div>
      </Container>
      </nav>
  )
}
