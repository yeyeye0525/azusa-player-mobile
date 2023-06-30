import React, { useState } from 'react';
import { IconButton, Text, TextInput, ProgressBar } from 'react-native-paper';
import { View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useTranslation } from 'react-i18next';

import { useNoxSetting } from '../../hooks/useSetting';

export default ({ onSearched = (vals: any) => console.log(vals) }) => {
  const { t } = useTranslation();
  const [searchVal, setSearchVal] = useState(
    'https://raw.githubusercontent.com/lovegaoshi/azusa-player-mobile/master/src/components/styles/steria.json'
  );
  const [searchProgress, progressEmitter] = useState(0);
  const playerStyle = useNoxSetting(state => state.playerStyle);

  const handleSearch = async (val = searchVal) => {
    progressEmitter(100);
    try {
      const searchedResult = await (await fetch(val)).json();
      onSearched(searchedResult);
    } catch {
      Snackbar.show({ text: t('CustomSkin.SearchFailMsg') });
    } finally {
      progressEmitter(0);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TextInput
          style={{ flex: 5 }}
          label={String(t('CustomSkin.SearchBarLabel'))}
          value={searchVal}
          onChangeText={val => setSearchVal(val)}
          onSubmitEditing={() => handleSearch(searchVal)}
          selectTextOnFocus
          selectionColor={playerStyle.customColors.textInputSelectionColor}
          textColor={playerStyle.colors.text}
        />
        <IconButton
          icon="search-web"
          onPress={() => handleSearch(searchVal)}
          size={30}
        />
      </View>
      <ProgressBar
        progress={Math.max(searchProgress, 0)}
        indeterminate={searchProgress === 1}
      />
    </View>
  );
};
