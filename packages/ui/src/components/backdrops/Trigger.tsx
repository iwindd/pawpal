interface ShowProps {
  text?: string;
}

export const show = (props: ShowProps | string) => {
  const text = typeof props === "string" ? props : props.text;

  document.dispatchEvent(
    new CustomEvent("triggerLoading", {
      detail: { isLoading: true, text: text },
    })
  );
};

export const hide = () => {
  document.dispatchEvent(
    new CustomEvent("triggerLoading", { detail: { isLoading: false } })
  );
};
