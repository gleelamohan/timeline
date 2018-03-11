import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Checkbox from 'design-system-react/components/forms/checkbox';

import './style.scss';

class CheckBox extends Component {

    constructor(props) {
        super(props);

        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);

        this.state = {
            isChecked: true
        };
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        handleCheckboxChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        disable: false,
        className: ''
    };

    toggleCheckboxChange() {
        const { handleCheckboxChange, id } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

        handleCheckboxChange(id);
    }

    render() {
        /* eslint-disable react/prop-types */
        const { label, disable, id, className } = this.props;
        const { isChecked } = this.state;

        return (

            <Checkbox
                assistiveText="Default"
                id={id}
                className={className}
                checked={isChecked}
                disabled={disable}
                label={label}
                onChange = {this.toggleCheckboxChange}
            />

        );
    }
}


export default CheckBox;
