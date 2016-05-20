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
			pan : new Animated.ValueXY(),
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
        	return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      		},
      		onPanResponderMove: Animated.event([null,{ //Step 3
            	dx : this.state.pan.x,
        	}]),
        	onPanResponderRelease: (e, gesture) => {

        		console.log("onPanResponderRelease");
        		if ( gesture.dx > (screenWidth/2) ){
        			Animated.spring(
                    this.state.pan,
                    	{toValue:{x:screenWidth,y:0}}
                	).start();
        		}else{
        			Animated.spring(
                    this.state.pan,
                    	{toValue:{x:0,y:0}}
                	).start();
        		}
        		
        	}
		});
	}

	render() {
		debugger;
		return (
			<View style={styles.container}>
				<Animated.View
					style={[styles.left, {left : this.state.pan.x._value-screenWidth }]}
					> 
					<Text style={[{ textAlign : 'left'}]}>left containerleft containerleft containerleft containerleft containerleft container</Text>
				</Animated.View>
				<Animated.View style={[styles.center, this.state.pan.getLayout()]}
					{...this.panResponder.panHandlers}> 
					<Text>center</Text> 
				</Animated.View>
			</View>
		);
	}
}

let Window = Dimensions.get('window');
let screenWidth = Dimensions.get('window').width;

let styles = StyleSheet.create({
	container: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: 'red',
  },
  left: {
    position: 'absolute',
    top:0,
    bottom:0,
    left:-screenWidth,
    backgroundColor: 'blue',
    width: screenWidth,
  },
});

