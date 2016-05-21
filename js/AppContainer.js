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
			pulledView : new Animated.Value(0),
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
        	return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      		},
      		onPanResponderMove: (e, gesture) => {
      			this.state.pan.setValue({x:gesture.dx, y:0});
      			this.state.pulledView.setValue(gesture.dx-screenWidth);
      			console.log(this.state.pan,this.state.pulledView,"on");
      		},
        	onPanResponderRelease: (e, gesture) => {

        		console.log( "onPanResponderRelease",screenWidth, gesture.dx );
        		if ( gesture.dx > (screenWidth/2) ){

        			console.log('change current, slide');
        			Animated.spring(
                    this.state.pan,
                    	{toValue:{x:screenWidth,y:0}}
                	).start();
                	Animated.spring(
                    this.state.pulledView,
                    	{toValue:0}
                	).start();

        		}else{

        			console.log('current is same, slide back')
        			Animated.spring(
                    this.state.pan,
                    	{toValue:{x:0,y:0}}
                	).start();
                	Animated.spring(
                    this.state.pulledView,
                    {toValue:-screenWidth}
                	).start();

        		}
        		
        	}
		});
	}

	listener() {
		console.log('aaa');
	}

	render() {
		console.log(this.state.pulledView,"pulled view");
		return (
			<View style={styles.container}>
				<Animated.View
					style={[ styles.left, { left : this.state.pulledView } ]}
					> 
					<Text>left containerleft containerleft containerleft containerleft containerleft container</Text>
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
    left:0,
    backgroundColor: 'blue',
    width: screenWidth,
  },
});

