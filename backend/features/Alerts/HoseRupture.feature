Feature: Hose rupture alert

  Scenario: Trigger alert if pressure is below the threshold
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
    Then The last alert for tenant "kuzzle" content match:
      | severity               | "critical"            |
      | document._id           | "H2Frame-H2-Cadre1"   |
      | alertRule._source.name | "Rupture de flexible" |

  Scenario: Does not trigger alert in maintenance mode
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I successfully execute the action "byes/maintenance":"maintenance" with args:
      | engineId         | "tenant-hyvision-kuzzle" |
      | assetId          | "H2Frame-H2-Cadre1"      |
      | body.maintenance | true                     |
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
    And I count 0 documents in "tenant-hyvision-kuzzle":"alerts"

  Scenario: Send a notification to registered contacts
    Given an existing collection "tenant-hyvision-kuzzle":"config"
    And I "create" the following documents:
      | body.contact.phone | body.type |
      | "+33622222222"     | "contact" |
    And I refresh the collection "tenant-hyvision-kuzzle":"config"
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
    Then The document "hermes-messenger":"messages":"Hyvision: Rupture de flexible pour \"Cadre1\" sur la voie \"channel4\"" content match:
      | account | "default"      |
      | to      | "+33622222222" |

  Scenario: Alert is triggered only once per asset until it's acknowledged
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    Given I create an asset H2Frame Cadre10 with its devices for tenant "kuzzle"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
    And I count 1 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"             |
      | document._id           | "H2Frame-H2-Cadre1"   |
      | alertRule._source.name | "Rupture de flexible" |
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "13"      | 18          | 0.4      |
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | document._id           | "H2Frame-H2-Cadre10"  |
      | alertRule._source.name | "Rupture de flexible" |
    # Trigger again for Cadre10
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "13"      | 18          | 0.4      |
    # No new alert
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"             |
      | document._id           | "H2Frame-H2-Cadre10"  |
      | alertRule._source.name | "Rupture de flexible" |
    When I acknowledge the alert "Rupture de flexible" of "H2Frame-H2-Cadre10" for tenant "kuzzle"
    # Trigger again for Cadre10
    And I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "13"      | 18          | 0.4      |
    And I count 3 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"             |
      | document._id           | "H2Frame-H2-Cadre10"  |
      | alertRule._source.name | "Rupture de flexible" |

  Scenario: Automatically acknowledge alert
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    Given I create an asset H2Frame Cadre10 with its devices for tenant "kuzzle"
    And I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
      | "13"      | 18          | 0.4      |
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 100      |
    Then The last alert "Rupture de flexible" for "H2Frame-H2-Cadre1" of tenant "kuzzle" content match:
      | status                 | "acknowledged"        |
      | severity               | "critical"            |
      | document._id           | "H2Frame-H2-Cadre1"   |
      | alertRule._source.name | "Rupture de flexible" |
    # Alert is acknowledged, let's trigger a new one
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "4"       | 18          | 0.4      |
    Then I count 3 documents in "tenant-hyvision-kuzzle":"alerts"
    And The last alert "Rupture de flexible" for "H2Frame-H2-Cadre1" of tenant "kuzzle" content match:
      | status                 | "pending"             |
      | severity               | "critical"            |
      | document._id           | "H2Frame-H2-Cadre1"   |
      | alertRule._source.name | "Rupture de flexible" |
