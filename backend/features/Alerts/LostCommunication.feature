Feature: Lost communication alert

  Scenario: Trigger alert if measure if too old
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    Then The last alert for tenant "kuzzle" content match:
      | severity               | "warning"                |
      | document._id           | "Srett-4"                |
      | alertRule._source.name | "Perte de communication" |

  Scenario: Does trigger alert in maintenance mode
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I successfully execute the action "byes/maintenance":"maintenance" with args:
      | engineId         | "tenant-hyvision-kuzzle" |
      | assetId          | "H2Frame-H2-Cadre1"      |
      | body.maintenance | true                     |
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    Then The last alert for tenant "kuzzle" content match:
      | severity               | "warning"                |
      | document._id           | "Srett-4"                |
      | alertRule._source.name | "Perte de communication" |

  Scenario: Send a notification to registered contacts
    Given an existing collection "tenant-hyvision-kuzzle":"config"
    And I "create" the following documents:
      | body.contact.phone | body.type |
      | "+33622222222"     | "contact" |
    And I refresh the collection "tenant-hyvision-kuzzle":"config"
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    Then The document "hermes-messenger":"messages":"Hyvision: Perte de communication pour le capteur \"4\"" content match:
      | account | "default"      |
      | to      | "+33622222222" |

  Scenario: Alert is triggered only once per asset until it's acknowledged
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    Given I create an asset H2Frame Cadre10 with its devices for tenant "kuzzle"
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    And I count 1 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"                |
      | document._id           | "Srett-4"                |
      | alertRule._source.name | "Perte de communication" |
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "13"       |
      | body.date        | "_3h_AGO_" |
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | document._id           | "Srett-13"               |
      | alertRule._source.name | "Perte de communication" |
    # Trigger again for Cadre10
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "13"       |
      | body.date        | "_3h_AGO_" |
    # No new alert
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"                |
      | document._id           | "Srett-13"               |
      | alertRule._source.name | "Perte de communication" |
    When I acknowledge the alert "Perte de communication" of "Srett-13" for tenant "kuzzle"
    # Trigger again for Srett-13
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "13"       |
      | body.date        | "_3h_AGO_" |
    And I count 3 documents in "tenant-hyvision-kuzzle":"alerts"
    Then The last alert for tenant "kuzzle" content match:
      | status                 | "pending"                |
      | document._id           | "Srett-13"               |
      | alertRule._source.name | "Perte de communication" |

  Scenario: Automatically acknowledge alert
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    Given I create an asset H2Frame Cadre10 with its devices for tenant "kuzzle"
    And I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    And I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_3h_AGO_" |
    And I count 2 documents in "tenant-hyvision-kuzzle":"alerts"
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18          |
      | body.pressure    | 100         |
      | body.reference   | "4"         |
      | body.date        | "_10s_AGO_" |
    Then The last alert "Perte de communication" for "Srett-4" of tenant "kuzzle" content match:
      | status                 | "acknowledged"           |
      | severity               | "warning"                |
      | document._id           | "Srett-4"                |
      | alertRule._source.name | "Perte de communication" |
    # Alert is acknowledged, let's trigger a new one
    When I successfully execute the action "device-manager/payload":"srett" with args:
      | body.temperature | 18         |
      | body.pressure    | 100        |
      | body.reference   | "4"        |
      | body.date        | "_2h_AGO_" |
    Then I count 3 documents in "tenant-hyvision-kuzzle":"alerts"
    And The last alert "Perte de communication" for "Srett-4" of tenant "kuzzle" content match:
      | status                 | "pending"                |
      | severity               | "warning"                |
      | document._id           | "Srett-4"                |
      | alertRule._source.name | "Perte de communication" |
