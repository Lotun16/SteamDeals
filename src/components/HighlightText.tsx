interface HighlightTextProps     {
    children: React.ReactNode;
    variant: 'discount' | 'buy' | 'wait';
}

const HighlightText = ({children, variant}: HighlightTextProps) => {

    const styles = {
        discount: { backgroundColor: "#4d6b22", color: "#beee11" },
        buy: { backgroundColor: "#22456b", color: "#1199ee" },
        wait: { backgroundColor: "#6b2222", color: "#ee1111" }
    };

    return (
        <div style={{
            ...styles[variant],
            display: "inline-block", 
            padding: "2px 8px", 
            marginLeft: "10px", 
            borderRadius: "4px"
        }}>
            {children}
        </div>
    )
}
 
export default HighlightText;