import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';

import {
  AdvancedModal,
  ExportBanListDelete,
  ExportBanListCreate
} from './index';

const query = gql`
  query {
    currentSteamUser {
      exportBanListsLimit
      exportBanLists {
        _id
        name
        config
        banCount
        battlemetricsStatus
        battlemetricsInvite

        exportBans {
          _id
          steamID
        }
      }
    }
  }
`;

export { query };

export default function() {
  return (
    <Query query={query} onError={() => {}}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Card className=" shadow">
              <CardHeader className=" bg-transparent">
                <h3 className=" mb-0">Export Ban Lists</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center mt-2 mb-3">Loading...</div>
                <div className="btn-wrapper text-center">
                  <i className="fas fa-circle-notch fa-spin fa-4x" />
                </div>
              </CardBody>
            </Card>
          );

        if (error)
          return (
            <Card className=" shadow">
              <CardHeader className=" bg-transparent">
                <h3 className=" mb-0">Export Ban Lists</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center mt-2 mb-2">Error!</div>
                <div className="btn-wrapper text-center">
                  <i className="fas fa-exclamation-triangle fa-4x" />
                </div>
                <div className="text-center mt-2 mb-2">
                  Something went wrong. Sad times.
                </div>
              </CardBody>
            </Card>
          );

        return (
          <Card className=" shadow">
            <CardHeader className=" bg-transparent">
              <h3 className=" mb-0">
                Export Ban Lists ({data.currentSteamUser.exportBanLists.length}{' '}
                / {data.currentSteamUser.exportBanListsLimit})
              </h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>Export Ban List Name</th>
                  <th>BattleMetrics Enabled</th>
                  <th>Ban Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.currentSteamUser.exportBanLists.map(
                  (exportBanList, key) => (
                    <tr key={key}>
                      <th>{exportBanList.name}</th>
                      <td>
                        {exportBanList.battlemetricsStatus !== 'disabled'
                          ? 'Yes'
                          : 'No'}
                      </td>
                      <td>{exportBanList.banCount}</td>
                      <td>
                        <AdvancedModal isOpen={false}>
                          {modal => (
                            <>
                              <Button
                                color="info"
                                size="sm"
                                onClick={modal.open}
                              >
                                Install
                              </Button>

                              <Modal
                                className="modal-dialog-centered"
                                isOpen={modal.isOpen}
                                toggle={modal.close}
                              >
                                <ModalHeader toggle={modal.close}>
                                  Install
                                </ModalHeader>
                                <ModalBody>
                                  <h5>Battlemetrics</h5>
                                  <p>
                                    {exportBanList.battlemetricsStatus ===
                                    'disabled' ? (
                                      <>
                                        Exporting to BattleMetrics has been
                                        disabled for this export ban list.
                                      </>
                                    ) : exportBanList.battlemetricsStatus ? (
                                      <>
                                        To use this export ban list within your
                                        BattleMetrics organisation please accept
                                        our{' '}
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href={
                                            exportBanList.battlemetricsInvite
                                          }
                                        >
                                          ban list invite
                                        </a>
                                        .
                                      </>
                                    ) : (
                                      <>
                                        We are still in the process of making
                                        your BattleMetrics ban list. Please
                                        check back again later.
                                      </>
                                    )}
                                  </p>
                                  <hr className="my-4" />
                                  <h5>Remove Ban List</h5>
                                  <p>
                                    To use this export ban list within your
                                    Squad server the following URL can be added
                                    as a remote ban list on your server. For
                                    information on how to achieve this, please
                                    refer to the{' '}
                                    <a href="https://squad.gamepedia.com/Server_Configuration#Remote_Ban_Lists_in_RemoteBanListHosts.cfg">
                                      Squad Wiki
                                    </a>
                                    .
                                  </p>
                                  <code>
                                    {`${window.location.protocol}//${window.location.hostname}/export/${exportBanList._id}`}
                                  </code>
                                </ModalBody>
                              </Modal>
                            </>
                          )}
                        </AdvancedModal>
                        <AdvancedModal isOpen={false}>
                          {modal => (
                            <>
                              <Button
                                color="info"
                                size="sm"
                                onClick={modal.open}
                              >
                                View Bans
                              </Button>

                              <Modal
                                className="modal-dialog-centered"
                                isOpen={modal.isOpen}
                                toggle={modal.close}
                              >
                                <ModalHeader toggle={modal.close}>
                                  Export Bans
                                </ModalHeader>
                                <ModalBody>
                                  <ul>
                                    {exportBanList.exportBans.map(
                                      (exportBan, key) => (
                                        <li>
                                          <a
                                            href={
                                              '/search/' + exportBan.steamID
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            key={key}
                                          >
                                            {exportBan.steamID}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </ModalBody>
                              </Modal>
                            </>
                          )}
                        </AdvancedModal>
                        <AdvancedModal isOpen={false}>
                          {modal => (
                            <>
                              <Button
                                color="warning"
                                size="sm"
                                onClick={modal.open}
                              >
                                Edit
                              </Button>

                              <Modal
                                className="modal-dialog-centered"
                                isOpen={modal.isOpen}
                                toggle={modal.close}
                              >
                                <ModalHeader toggle={modal.close}>
                                  Edit Export Ban List
                                </ModalHeader>
                                <ModalBody className="bg-secondary">
                                  <ExportBanListCreate
                                    _id={exportBanList._id}
                                    name={exportBanList.name}
                                    config={exportBanList.config}
                                    update={true}
                                    onSubmit={modal.close}
                                    key={key}
                                  />
                                </ModalBody>
                              </Modal>
                            </>
                          )}
                        </AdvancedModal>
                        <ExportBanListDelete _id={exportBanList._id} />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
            <CardBody>
              <Row>
                <Col className="text-center">
                  <AdvancedModal isOpen={false}>
                    {modal => (
                      <>
                        <Button color="primary" onClick={modal.open}>
                          Create Export Ban List
                        </Button>

                        <Modal
                          className="modal-dialog-centered"
                          isOpen={modal.isOpen}
                          toggle={modal.close}
                        >
                          <ModalHeader toggle={modal.close}>
                            Create Export Ban List
                          </ModalHeader>
                          <ModalBody className="bg-secondary">
                            <ExportBanListCreate onSubmit={modal.close} />
                          </ModalBody>
                        </Modal>
                      </>
                    )}
                  </AdvancedModal>
                </Col>
              </Row>
            </CardBody>
          </Card>
        );
      }}
    </Query>
  );
}
