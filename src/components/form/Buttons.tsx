'use client'

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { LuTrash2, LuSquare } from 'react-icons/lu';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type btnSize = 'lg' | 'default' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export default function Buttons({className = '', text = 'submit', size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return(
     <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type ActionType = 'edit' | 'delete';

export const IconButton = ({
  actionType,
  onClick,
  disabled,
}: {
  actionType: ActionType;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <LuSquare />;
      case "delete":
        return <LuTrash2 />;
      default:
        const _exhaustiveCheck: never = actionType;
        throw new Error(`Unhandled action type: ${_exhaustiveCheck}`);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded hover:bg-muted transition"
    >
      {renderIcon()}
    </button>
  );
};
