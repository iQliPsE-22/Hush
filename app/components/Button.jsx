"use client";

const Button = (props) => {
  return (
    <div className=" julius flex justify-center w-full bgColor-red z-1">
      <button
        type={props.type}
        className={`w-dvw lg:w-3/12 p-3 lg:p-4 mb-2 text-black rounded-lg flex justify-center items-center cursor-pointer z-2`}
        style={{ backgroundColor: props.bg, color: props.color }}
        onClick={props.onClick}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
