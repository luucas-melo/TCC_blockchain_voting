import {
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { ActionButton } from "../ActionButton";
import { DangerPopup } from "../DangerPopup";

interface VotingMenuProps {
  startVoting: () => Promise<void>;
  cancelVoting: () => Promise<void>;
  onEdit: () => void;
}

export function VotingMenu(props: VotingMenuProps) {
  const { startVoting, cancelVoting, onEdit } = props;

  return (
    <Menu autoSelect={false} isLazy>
      <MenuButton
        as={ActionButton}
        icon={<Icon as={BsThreeDotsVertical} />}
        colorScheme="gray"
      />
      <Portal>
        <MenuList>
          <MenuItem onClick={onEdit}>Editar</MenuItem>
          <MenuItem onClick={startVoting}>Iniciar</MenuItem>
          <MenuDivider />
          <DangerPopup
            title="Cancelar votação"
            message="Você tem certeza que deseja cancelar essa votação?"
            onConfirm={cancelVoting}
            closeOnBlur={false}
          >
            <MenuItem color="red.400" closeOnSelect={false}>
              Cancelar
            </MenuItem>
          </DangerPopup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
