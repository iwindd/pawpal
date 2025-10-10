interface DropzoneTriggerBase {
  error?: string | null;
  h?: number | string;
}

export interface DropzoneTriggerProps extends DropzoneTriggerBase {
  label?: string;
  placeholder?: string;
  hint: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export interface DropzoneTriggerHasImageProps extends DropzoneTriggerBase {
  selectedResource: ResourceResponse | null;
  onOpen: () => void;
}

export interface DropzoneTriggerNoImageProps extends DropzoneTriggerBase {
  placeholder?: DropzoneTriggerProps["placeholder"];
  hint: DropzoneTriggerProps["hint"];
  onOpen: () => void;
}
