function InputFormForList({ type = "text",accept, Id, funct,index, item}) {
  return (
    <input
    type={type}
    className={"input mini-input"}
    defaultValue={item }
    accept={accept}
    id={Id}
    onChange={(e) => funct(index, e.target.value)}
    />
  );
}

export default InputFormForList;