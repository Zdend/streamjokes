import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const handleKeyEvent = ({ history, nextPath, prevPath }) => (e) => {
    const code = e.keyCode || e.which;

    if (code == 37 && prevPath) { // left
        history.push(prevPath);
    } else if (code == 39 && nextPath) { // right
        history.push(nextPath);
    }
};

const CategoryPageKeys = (props) => {
    useEffect(() => {
        const handler = handleKeyEvent(props);
        document.addEventListener('keyup', handler, false);

        return () => {
            document.removeEventListener('keyup', handler, false);
        };
    }, [props.nextPath, props.prevPath]);
    return null;
};

export default withRouter(CategoryPageKeys);