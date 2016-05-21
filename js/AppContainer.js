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
			offset : {
				center : new Animated.Value(0),
				left : new Animated.Value(0),
			},
			currentView : CurrentView.Center,
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
        	return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      		},
      		onPanResponderMove: (e, gesture) => {
      			//handle move gesture
      			this.handleMoveGesture(e,gesture);
      			  			
      		},
        	onPanResponderRelease: (e, gesture) => {
        		//hand gesture release
        		this.handleMoveGestureRelease(e,gesture);
        		console.log( "onPanResponderRelease",screenWidth, gesture.dx );
        	}
		});
	}

	handleMoveGesture(e, gesture) {
		console.log('handleMoveGesture');
		let {center, left} = this.state.offset;
		switch (this.state.currentView){
      				case CurrentView.Center : 
	      				center.setValue(gesture.dx);
	      				left.setValue(gesture.dx-screenWidth);
	      				break;
	      			case CurrentView.Left :
	      				break;
      			}    
	}

	handleMoveGestureRelease(e, gesture) {
		let {center, left} = this.state.offset;
		switch (this.state.currentView){
        			case CurrentView.Center :
        				if ( gesture.dx > (screenWidth/2) ){

		        			console.log('change current, slide');
		        			Animated.spring(
		                    center,
		                    	{toValue:screenWidth}
		                	).start();
		                	Animated.spring(
		                    left,
		                    	{toValue:0}
		                	).start();
		                	this.setState({currentView : CurrentView.left});
	        		}else{
	        			console.log('current is same, slide back');
	        			Animated.spring(
	                    center,
	                    	{toValue:0}
	                	).start();

	                	Animated.spring(
	                    left,
	                    {toValue:-screenWidth}
	                	).start();
	        		}
	        		break;
        		}
	}


	listener() {
		console.log('aaa');
	}

	render() {
		let {center, left} = this.state.offset;
		console.log(this.state.pulledView,"pulled view");
		return (
			<View style={styles.container}>
				<Animated.View
					style={[ styles.left, { left : left } ]}
					{...this.panResponder.panHandlers}
					> 
					<Text>left containerleft containerleft containerleft containerleft containerleft container</Text>
				</Animated.View>
				<Animated.View style={[styles.center, { left : center }]}
					{...this.panResponder.panHandlers}> 
					<Text>center</Text> 
				</Animated.View>
			</View>
		);
	}
}

const CurrentView = { Center : 'center', Left : 'left', Right : 'right', Top : 'top' };
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

