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
      			switch (this.state.currentView){
      				case CurrentView.Center : 
	      				this.state.offset.center.setValue(gesture.dx);
	      				this.state.offset.left.setValue(gesture.dx-screenWidth);
	      				break;
	      			case CurrentView.Left :
	      				break;
      			}      			
      		},
        	onPanResponderRelease: (e, gesture) => {

        		console.log( "onPanResponderRelease",screenWidth, gesture.dx );
        		if ( gesture.dx > (screenWidth/2) ){

        			console.log('change current, slide');
        			Animated.spring(
                    this.state.offset.center,
                    	{toValue:screenWidth}
                	).start();
                	Animated.spring(
                    this.state.offset.left,
                    	{toValue:0}
                	).start();

        		}else{

        			console.log('current is same, slide back');
        			Animated.spring(
                    this.state.offset.center,
                    	{toValue:0}
                	).start();

                	Animated.spring(
                    this.state.offset.left,
                    {toValue:-screenWidth}
                	).start();

                	this.setState({currentView : CurrentView.left});

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
					style={[ styles.left, { left : this.state.offset.left } ]}
					{...this.panResponder.panHandlers}
					> 
					<Text>left containerleft containerleft containerleft containerleft containerleft container</Text>
				</Animated.View>
				<Animated.View style={[styles.center, { left : this.state.offset.center }]}
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

