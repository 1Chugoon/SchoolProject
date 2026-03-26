function InputForm({TextPlaceholder, zstyle, type = "text",accept, Id, funct, defaultText}) {
  return (
    <input
    type={type}
    className={"input "+ zstyle}
    placeholder={TextPlaceholder}
    accept={accept}
    id={Id}
    onChange={(e) => {
  if (type === "file") {
    funct?.(e);
  } else {
    funct?.(e.target.value);
  }
}}
    defaultValue={defaultText}
    />
  );
}

export default InputForm;