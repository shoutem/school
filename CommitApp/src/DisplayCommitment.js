
import React, { Component } from 'react';
import { takeRightWhile, last } from 'lodash';
import { View, Heading, Title, TouchableOpacity, TextInput } from '@shoutem/ui';
import CircleButton from './CircleButton';


const CommitmentDay = ({ done, style }) => (
    <View style={style} styleName={done ? 'done' : 'undone'}>

    </View>
);

class DisplayCommitment extends Component {
    get days() {
        const { doneDates } = this.props;

        return takeRightWhile(doneDates,
                              (time, i, arr) => (time - (arr[i-1] || arr[i])) / (1000*60*60) < 28).length
    }

    get doneToday() {
        const { doneDates } = this.props,
              today = new Date();

        return doneDates.length > 0
            && last(doneDates).getDay() === today.getDay()
            && last(doneDates).getMonth() === today.getMonth()
            && last(doneDates).getYear() === today.getYear();
    }

    get doneList() {
        const { doneDates } = this.props,
              N = 50;

        let done = [...Array(N).keys()].map(i => false);

        if (doneDates.length === 0) {
            return done;
        }

        let firstDay = new Date(doneDates[0].getTime()),
            today = new Date();

        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setSeconds(0);

        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);

        const daysSinceFirst = Math.ceil((today - firstDay)/(1000*60*60*24)),
              todayIndex = daysSinceFirst > N-3 ? N-3 : daysSinceFirst;

        for (let i = todayIndex, d = 0; i >= 0; i--, d++) {
            let dayStart = new Date(),
                dayEnd = new Date();

            dayStart.setDate(dayStart.getDate()-d);
            dayStart.setHours(0);
            dayStart.setMinutes(0);
            dayStart.setSeconds(0);

            dayEnd.setDate(dayEnd.getDate()-d);
            dayEnd.setHours(23);
            dayEnd.setMinutes(59);
            dayEnd.setSeconds(59);

            done[i] = doneDates.find(d => d >= dayStart && d <= dayEnd);
        }
        return done;
    }

    onDone = () => {
        if (!this.doneToday) {
            this.props.onDone();
        }
    }

    render() {
        const { id, commitment, onEdit, onDone, style } = this.props;

        return (
            <View style={style.main}>
                <View styleName="sm-gutter-top lg-gutter-left lg-gutter-right">
                    <Heading style={style.text}>Did you</Heading>
                    <TouchableOpacity style={style.textCommitment} onPress={onEdit}>
                        <Heading styleName="variable">{commitment}</Heading>
                    </TouchableOpacity>
                    <Heading style={style.text}>today?</Heading>
                </View>
                <View styleName="center xl-gutter-top lg-gutter-left lg-gutter-right">
                    {!this.doneToday ? <CircleButton styleName="green large" text="Yes" onPress={this.onDone} />
                                     : <CircleButton styleName="transparent large" text="Done" />}
                </View>
                <View styleName="center horizontal xl-gutter-top lg-gutter-left lg-gutter-right">
                    <Title styleName="variable">{this.days}</Title><Title> {this.days === 1 ? 'day' : 'days'} in a row</Title>
                </View>
                <View styleName="horizontal md-gutter-top">
                    {this.doneList.map((done, i) => <CommitmentDay done={done} style={style.day} key={i} />)}
                </View>
            </View>
        )
    }
}

export default DisplayCommitment;
