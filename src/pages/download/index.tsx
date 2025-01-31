import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'gatsby';
import { LocalizedLink as Link } from 'gatsby-theme-i18n';
import { detectOS } from '../../util/detectOS';
import { getUpcomingReleases } from '../../util/getUpcomingReleases';
import Layout from '../../components/Layout';
import DownloadHeader from '../../components/DownloadHeader';
import DownloadToggle from '../../components/DownloadToggle';
import DownloadCards from '../../components/DownloadCards';
import DownloadReleases from '../../components/DownloadReleases';
import DownloadAdditional from '../../components/DownloadAdditional';
import { NodeReleaseData } from '../../types';
import styles from './index.module.scss';

export interface DownloadNodeReleases {
  nodeReleases: {
    nodeReleasesData: NodeReleaseData[];
  };
}

interface Props {
  location: Location;
  data: DownloadNodeReleases;
}

const DownloadPage = ({ data: { nodeReleases } }: Props): JSX.Element => {
  const { nodeReleasesData } = nodeReleases;
  const [typeRelease, setTypeRelease] = useState('LTS');

  const userOS = detectOS();

  const filteredReleases = nodeReleasesData.filter(
    release => release.status !== 'End-of-life'
  );

  const lts = filteredReleases.find(release => release.isLts);
  const current = filteredReleases.find(
    release => release.status === 'Current'
  );

  const selectedType = typeRelease === 'LTS' ? lts : current;

  const handleTypeReleaseToggle = (
    selected: React.SetStateAction<string>
  ): void => setTypeRelease(selected);

  const upcomingReleases = getUpcomingReleases(filteredReleases);

  return (
    <Layout title="Download Node.js" description="Come get me!">
      <div className={`home-container ${styles.downloadPageContainer}`}>
        <DownloadHeader release={selectedType} />
        <p className={styles.releaseDescription}>
          <FormattedMessage id="pages.download.description" />{' '}
          <Link to="/download/package-manager">
            <FormattedMessage id="pages.download.packageManager" />
          </Link>
          .
        </p>
        <DownloadToggle
          selected={typeRelease}
          handleClick={handleTypeReleaseToggle}
        />
        <DownloadCards line={selectedType} userOS={userOS} />
        <DownloadReleases
          nodeReleasesData={filteredReleases}
          upcomingReleases={upcomingReleases}
        />
        <DownloadAdditional
          line={selectedType}
          selectedTypeRelease={typeRelease}
          handleTypeReleaseToggle={handleTypeReleaseToggle}
        />
      </div>
    </Layout>
  );
};

export default DownloadPage;

export const query = graphql`
  query {
    nodeReleases {
      nodeReleasesData {
        fullVersion
        version
        codename
        isLts
        status
        initialRelease
        ltsStart
        maintenanceStart
        endOfLife
      }
    }
  }
`;
