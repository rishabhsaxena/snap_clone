import React,{ Component } from 'react';

import {	
	View,
	Text,
	PanResponder,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';

export default class AppContainer extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			pan : new Animated.ValueXY()
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
        	return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      		},
      		onPanResponderMove: Animated.event([null,{ //Step 3
            	dx : this.state.pan.x,
        	}]),
        	onPanResponderRelease: (e, gesture) => {debugger;}
		});
	}	



	render() {
		return (
			<View style={styles.container}>
				<View 
					style={[styles.left]}
					> 
					<Text>left container</Text>
				</View>
				<Animated.View style={[styles.center, this.state.pan.getLayout()]}
					{...this.panResponder.panHandlers}> 
					<Text>center</Text> 
				</Animated.View>
			</View>
		);
	}
}

let styles = StyleSheet.create({
	container: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: 'red',
    left: 100,
  },
  left: {
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right: 0,
    backgroundColor: 'blue',
  },
});

