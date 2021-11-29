import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

export const KeycodeInput = (props) => {
  const [inputValue, setInputValue] = useState(props.defaultValue);
  useEffect(() => {
    if (props.value !== undefined && props.value !== inputValue) {
      setInputValue(props.value);
    }
  }, [props.value]);

  if (props.value !== undefined && !props.onChange) {
    throw new Error(
      'To use the KeycodeInput as a controlled component, ' +
      'you need to supply both the value and onChange props.'
    );
  }

  const changeText = (value) => {
    if (props.uppercase) {
      value = value.toUpperCase();
    }
    if (props.alphaNumeric) {
      value = value.replace('/[^a-z0-9]/i', '');
    }

    setInputValue(value);

    if (props.onChange) {
      props.onChange(value);
    }

    if (value.length < props.length) {
      return;
    }

    if (props.onComplete) {
      props.onComplete(value);
    }
  };

  const renderBoxes = () => {
    let elements = [];
    let i = 0;
    let vals = inputValue.split('');
    while (i < props.length) {
      let active = i === inputValue.length;
      let barStyles = [styles.bar, active ? [styles.barActive, { backgroundColor: props.tintColor }] : []];

      elements.push(
        <View style={styles.box} key={i}>
          <Text style={styles.text}>{vals[i] || ''}</Text>
          <View style={barStyles}/>
        </View>
      );

      i++;
    }

    return elements;
  };

  let keyboardType = props.numeric ? 'numeric' : (Platform.OS === 'ios' ? 'ascii-capable' : 'default');

  return (
    <View style={[styles.container, props.style]}>
      {renderBoxes()}
      <TextInput
        ref={(component) => {
          if (props.inputRef) {
            props.inputRef(component);
          }
        }}
        style={[styles.input, { color: props.textColor, width: 42 * props.length }]}
        autoFocus={props.autoFocus}
        autoCorrect={false}
        autoCapitalize='characters'
        value={inputValue}
        blurOnSubmit={false}
        keyboardType={keyboardType}
        maxLength={props.length}
        disableFullscreenUI
        clearButtonMode='never'
        spellCheck={false}
        returnKeyType='go'
        underlineColorAndroid='transparent'
        onChangeText={(text) => changeText(text)}
        caretHidden/>
    </View>
  );
};

KeycodeInput.propTypes = {
  length: PropTypes.number,
  tintColor: PropTypes.string,
  textColor: PropTypes.string,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  autoFocus: PropTypes.bool,
  uppercase: PropTypes.bool,
  alphaNumeric: PropTypes.bool,
  numeric: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.any,
  inputRef: PropTypes.func
};

KeycodeInput.defaultProps = {
  tintColor: '#007AFF',
  textColor: '#000',
  length: 4,
  autoFocus: true,
  numeric: false,
  alphaNumeric: true,
  uppercase: true,
  defaultValue: ''
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  input: {
    height: 48,
    position: 'absolute',
    opacity: 0,
    zIndex: 100
  },
  box: {
    width: 32,
    marginHorizontal: 5
  },
  bar: {
    backgroundColor: '#CED5DB',
    height: 1,
    width: 32
  },
  barActive: {
    height: 2,
    marginTop: -0.5
  },
  text: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 36,
    height: 36,
    textAlign: 'center',
    width: 32,
    marginBottom: 8
  }
});