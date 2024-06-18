export const LeftArrow = (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.67 0L19.5 2.829L10.161 12.004L19.5 21.171L16.67 24L4.5 12.004L16.67 0Z" fill={props.disabled? "#757575" : props.inverse? "white" : "#262729"}/>
    </svg>
);

export const RightArrow = (props: any) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.33 24L4.5 21.171L13.839 11.996L4.5 2.829L7.33 0L19.5 11.996L7.33 24Z" fill={props.disabled? "#757575" : props.inverse? "white" : "#262729"}/>
    </svg>
);