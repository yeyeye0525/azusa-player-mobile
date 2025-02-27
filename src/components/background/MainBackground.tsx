import React, { useState } from 'react';
import { ImageBackground, Dimensions, View, StyleSheet } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';
import Video from 'react-native-video';
import { useNoxSetting } from '@stores/useApp';
import { customReqHeader } from '@utils/BiliFetch';
import { logger } from '@utils/Logger';
import { useIsLandscape } from '@hooks/useOrientation';
import resolveBackgroundImage, {
  RESOLVE_TYPE,
} from '@utils/mediafetch/mainbackgroundfetch';

const MainBackground = ({ children }: { children: React.JSX.Element }) => {
  const playerStyle = useNoxSetting(state => state.playerStyle);
  const isLandscape = useIsLandscape();
  const mobileHeight = Dimensions.get('window').height;
  const [bkgrdImg, setBkgrdImg] = useState<NoxTheme.backgroundImage>();
  const bkgrdImgRaw =
    isLandscape && playerStyle.bkgrdImgLandscape
      ? playerStyle.bkgrdImgLandscape
      : playerStyle.bkgrdImg;

  React.useEffect(() => {
    resolveBackgroundImage(bkgrdImgRaw).then(setBkgrdImg);
  }, [bkgrdImgRaw]);

  // TODO: are these still necessary since they are behind await initPlayer?
  if (!bkgrdImg) return <>{children}</>;

  switch (bkgrdImg.type) {
    case RESOLVE_TYPE.image:
      return (
        <ImageBackground
          source={{ uri: bkgrdImg.identifier }}
          resizeMode="cover"
          style={[styles.mobileStyle, { height: mobileHeight }]}
        >
          <View
            style={{ backgroundColor: playerStyle.colors.background, flex: 1 }}
          >
            {children}
          </View>
        </ImageBackground>
      );
    case RESOLVE_TYPE.video:
      return (
        <>
          <Video
            source={{
              uri: bkgrdImg.identifier,
              headers: customReqHeader(bkgrdImg.identifier, {}),
            }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            onError={logger.error}
            /**
            isLooping
            resizeMode={ResizeMode.COVER}
            shouldPlay={true}
            isMuted={true}
             *
             */
            repeat
            muted
            resizeMode="cover"
            disableFocus={true}
            preventsDisplaySleepDuringVideoPlayback={false}
          />
          <View
            style={[
              styles.fullscreenStyle,
              { backgroundColor: playerStyle.colors.background },
            ]}
          >
            {children}
          </View>
        </>
      );
    default:
      return <>{children}</>;
  }
};

const styles = StyleSheet.create({
  mobileStyle: {
    flex: 1,
  },
  videoStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  fullscreenStyle: {
    width: '100%',
    height: '100%',
  },
});

export default MainBackground;
