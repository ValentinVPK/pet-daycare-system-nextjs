import { Button } from "./ui/button";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children: React.ReactNode;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  onClick,
}: PetButtonProps) {
  if (actionType === "add") {
    return <Button size="icon">{children}</Button>;
  }

  if (actionType === "edit") {
    return (
      <Button variant="secondary" className="bg-zinc-200 hover:bg-zinc-300">
        {children}
      </Button>
    );
  }

  if (actionType === "checkout") {
    return (
      <Button
        variant="secondary"
        className="bg-zinc-200 hover:bg-zinc-300"
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
}
