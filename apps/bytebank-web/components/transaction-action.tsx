import { Trash2Icon, SquarePen, ClipboardList } from "lucide-react";
import type { ReactElement, MouseEventHandler } from "react";

import { Button } from "@fiap-tech-challenge/design-system/components";

type TransactionActionType = "delete" | "edit" | "details";

type TransactionActionProps = {
  type: TransactionActionType;
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  title?: string;
}

const iconMap: Record<TransactionActionType, ReactElement> = {
  delete: <Trash2Icon className="w-5 h-5" />,
  edit: <SquarePen className="w-5 h-5" />,
  details: <ClipboardList className="w-5 h-5" />,
};

const defaultTitleMap: Record<TransactionActionType, string> = {
  delete: "Excluir",
  edit: "Editar",
  details: "Detalhes",
};

export function TransactionAction(props: TransactionActionProps) {
  const { disabled, onClick, title, type } = props;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title={title ?? defaultTitleMap[type]}
    >
      {iconMap[type]}
    </Button>
  );
}
