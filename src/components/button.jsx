export default function button(props){
  return(
    <>
    <button className={props.style} onClick={props.onClick}>
        {props.children}
      </button>
    </>
  )
}