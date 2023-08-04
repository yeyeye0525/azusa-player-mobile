import React, { useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { logger } from '@utils/Logger';
import { exportPlayerContent } from '@utils/ChromeStorage';

interface ImportProps {
  restoreFromUint8Array: (data: Uint8Array) => Promise<void>;
  noxRestore: () => Promise<any>;
  login: (
    callback: () => any,
    errorHandling: (e: Error) => void
  ) => Promise<boolean>;
}

interface ExportProps {
  noxBackup: (content: Uint8Array) => Promise<any>;
  login: (
    callback: () => any,
    errorHandling: (e: Error) => void
  ) => Promise<boolean>;
}

interface Props {
  restoreFromUint8Array: (data: Uint8Array) => Promise<void>;
  noxRestore: () => Promise<any>;
  noxBackup: (content: Uint8Array) => Promise<any>;
  login: (
    callback: () => any,
    errorHandling: (e: Error) => void
  ) => Promise<boolean>;
}

export interface GenericProps {
  restoreFromUint8Array: (data: Uint8Array) => Promise<void>;
}

const ImportSyncFavButton = ({
  restoreFromUint8Array,
  noxRestore,
  login,
}: ImportProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const errorHandling = (e: Error, msg = t('Sync.DropboxDownloadFail')) => {
    logger.error(e);
    Snackbar.show({ text: msg });
    setLoading(false);
  };

  const cloudDownload = async () => {
    setLoading(true);
    const response = await noxRestore();
    if (response !== null) {
      await restoreFromUint8Array(response);
      Snackbar.show({ text: t('Sync.DropboxDownloadSuccess') });
    } else {
      errorHandling(
        new Error(String(t('Sync.DropboxDownloadFail'))),
        String(t('Sync.DropboxDownloadFail'))
      );
    }
    setLoading(false);
    return response;
  };

  const loginAndDownload = async () => {
    setLoading(true);
    await login(cloudDownload, errorHandling);
  };

  return loading ? (
    <ActivityIndicator size={60} style={styles.activityIndicator} />
  ) : (
    <IconButton
      icon="cloud-download"
      onPress={loginAndDownload}
      size={60}
      style={styles.iconButton}
    />
  );
};

const ExportSyncFavButton = ({ noxBackup, login }: ExportProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const errorHandling = (
    e: Error,
    msg = String(t('Sync.DropboxUploadFailSnackbar'))
  ) => {
    logger.error(e);
    Snackbar.show({ text: msg });
    setLoading(false);
  };

  const cloudUpload = async () => {
    setLoading(true);
    const exportedDict = await exportPlayerContent();
    const response = await noxBackup(exportedDict);
    if ([200, 201].includes(response.status)) {
      Snackbar.show({ text: t('Sync.DropboxUploadSuccess') });
    } else {
      errorHandling(new Error(String(response.status)));
    }
    setLoading(false);
    return response;
  };

  const loginAndUpload = async () => {
    setLoading(true);
    await login(cloudUpload, errorHandling);
  };

  return loading ? (
    <ActivityIndicator size={60} style={styles.activityIndicator} />
  ) : (
    <IconButton
      icon="cloud-upload"
      onPress={loginAndUpload}
      size={60}
      style={styles.iconButton}
    />
  );
};

export default ({
  restoreFromUint8Array,
  login,
  noxBackup,
  noxRestore,
}: Props) => {
  return (
    <View style={styles.container}>
      <ImportSyncFavButton
        restoreFromUint8Array={restoreFromUint8Array}
        login={login}
        noxRestore={noxRestore}
      />
      <View style={styles.spacing}></View>
      <ExportSyncFavButton login={login} noxBackup={noxBackup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {},
  iconButton: {},
  spacing: {
    width: 20,
  },
});