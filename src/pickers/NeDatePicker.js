import React, { Component } from "react";
import moment from "moment";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { FormControl, TextField, IconButton, Grid } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { formatMessage } from "../helpers/i18n";
import { formatDateFromISO } from "./NeDateFormatter";
import withModulesManager from "../helpers/modules.js";

const styles = theme => ({
});

function toISODate(d) {
    if (!d) return null;
    const a = moment(d).toArray().slice(0, 3);
    a[0] = ('0000' + a[0]).slice(-4);
    a[1] = ('00' + (a[1] + 1)).slice(-2);
    a[2] = ('00' + a[2]).slice(-2);
    return a.join('-');
}

class NeDatePicker extends Component {

    state = { isoValue: null, strValue: '' }

    componentDidMount() {
        this.$el = $(this.el);
        $(this.$el).nepaliDatePicker({
            dateFormat: "%y-%m-%d",
            closeOnDateSelect: true,
        });
        this.setState(
            {
                isoValue: this.props.value,
                strValue: formatDateFromISO(this.props.value),
            }
        );
        this.$el.on('dateSelect', this.dateChange);
    }

    componentDidUpdate(prevState, prevProps, snapshot) {
        if (prevState.value !== this.props.value) {
            this.setState({
                isoValue: this.props.value,
                strValue: formatDateFromISO(this.props.value),
            })
        }
    }

    componentWillUnmount() {
        this.$el.off('dateSelect', this.dateChange);
    }

    dateChange = e => {
        this.setState(
            {
                isoValue: toISODate(e.datePickerData.adDate),
                strValue: e.datePickerData.formattedDate,
            },
            i => this.props.onChange(this.state.isoValue)
        );
    }

    clear = e => {
        this.setState(
            {
                isoValue: null,
                strValue: '',
            },
            i => this.props.onChange(null)
        );
    }    

    render() {
        const { intl, classes, module, label, readOnly = false, fullWidth = true } = this.props;
        return (
            <FormControl fullWidth={fullWidth}>
                <Grid container direction="row" alignItems="center" alignContent="center">
                    <Grid item xs={10}>
                        <TextField
                            value={this.state.strValue}
                            readOnly={readOnly}
                            label={!!label ? formatMessage(intl, module, label) : null}
                            ref={el => this.el = el}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={this.clear}><ClearIcon /></IconButton>
                    </Grid>
                </Grid>
            </FormControl>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(NeDatePicker))));