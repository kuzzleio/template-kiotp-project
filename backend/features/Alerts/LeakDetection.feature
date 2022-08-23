Feature: Leak detection alert

  Scenario: Trigger alert if another channel than the active one has consumption
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I successfully execute the action "device-manager/asset":"pushMeasures" with args:
      | engineId         | "tenant-hyvision-kuzzle"                                         |
      | _id              | "H2Frame-H2-Cadre1"                                              |
      | body.measures[0] | { type: "activeChannel", values: { activeChannel: "channel1" } } |
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 41          | 100      |
      | "2"       | 42          | 100      |
      | "1"       | 41          | 90       |
      | "2"       | 42          | 99       |
    Then The last alert for tenant "kuzzle" content match:
      | severity               | "warning" |
      | document._id           | "Srett-2" |
      | alertRule._source.name | "Fuite"   |

  Scenario: Does not trigger alert in maintenance mode
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I successfully execute the action "byes/maintenance":"maintenance" with args:
      | engineId         | "tenant-hyvision-kuzzle" |
      | assetId          | "H2Frame-H2-Cadre1"      |
      | body.maintenance | true                     |
    And I successfully execute the action "device-manager/asset":"pushMeasures" with args:
      | engineId         | "tenant-hyvision-kuzzle"                                         |
      | _id              | "H2Frame-H2-Cadre1"                                              |
      | body.measures[0] | { type: "activeChannel", values: { activeChannel: "channel1" } } |
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 41          | 100      |
      | "2"       | 42          | 100      |
      | "1"       | 41          | 90       |
      | "2"       | 42          | 99       |
    And I refresh the collection "tenant-hyvision-kuzzle":"alerts"
    And I count 0 documents in "tenant-hyvision-kuzzle":"alerts"

  Scenario: Send a notification to registered contacts
    Given an existing collection "tenant-hyvision-kuzzle":"config"
    And I "create" the following documents:
      | body.contact.phone | body.type |
      | "+33622222222"     | "contact" |
    And I refresh the collection "tenant-hyvision-kuzzle":"config"
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I successfully execute the action "device-manager/asset":"pushMeasures" with args:
      | engineId         | "tenant-hyvision-kuzzle"                                         |
      | _id              | "H2Frame-H2-Cadre1"                                              |
      | body.measures[0] | { type: "activeChannel", values: { activeChannel: "channel1" } } |
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 41          | 100      |
      | "2"       | 42          | 100      |
      | "1"       | 41          | 90       |
      | "2"       | 42          | 99       |
    Then The document "hermes-messenger":"messages":"Hyvision: Fuite sur la voie non active \"2\" pour \"Cadre1\"" content match:
      | account | "default"      |
      | to      | "+33622222222" |
