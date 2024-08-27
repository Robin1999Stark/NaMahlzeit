interface LinkifyProps {
    text: string;
}

const URLify: React.FC<LinkifyProps> = ({ text }) => {
    const linkifyText = (inputText: string): string => {
        // Regular expression to match URLs
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;

        return inputText.replace(urlRegex, (url) => {
            // If the URL starts with 'http://' or 'https://', return it as a clickable link
            return `<a href="${url}" style="color: #6F64EA" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    };

    return <span dangerouslySetInnerHTML={{ __html: linkifyText(text) }} />;
};

export default URLify;