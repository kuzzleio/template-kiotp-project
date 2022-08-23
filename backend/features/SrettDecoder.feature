Feature: Srett Decoder

  Scenario: Decode temperature and pressure
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 18          | 100      |
    Then The document "platform":"devices":"Srett-1" content match:
      | measures[0].type               | "channel" |
      | measures[0].values.temperature | 291.15    |
      | measures[0].values.pressure    | 10000000  |

  Scenario: Mole and weight should be computed when assigned to an asset
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 18          | 100      |
    Then The document "tenant-hyvision-kuzzle":"assets":"H2Frame-H2-Cadre1" content match:
      | measures[0].type               | "channel"          |
      | measures[0].values.temperature | 291.15             |
      | measures[0].values.pressure    | 10000000           |
      | measures[0].values.mole        | 3038.6482213640775 |
      | measures[0].values.weight      | 6.125550176483417  |

  Scenario: Consumption should be computed
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 18          | 100      |
      | "2"       | 18          | 100      |
      | "1"       | 18          | 98       |
      | "2"       | 18          | 100      |
    Then The document "platform":"devices":"Srett-1" content match:
      | measures[0].type               | "channel"         |
      | measures[0].values.mole        | 2982.904628046501 |
      | measures[0].values.consumption | 55.7435933175766  |
    And The document "platform":"devices":"Srett-2" content match:
      | measures[0].type               | "channel"          |
      | measures[0].values.mole        | 3038.6482213640775 |
      | measures[0].values.consumption | 0                  |

  Scenario: ActiveChannel should be computed from an average consumption
    Given I create an asset H2Frame Cadre1 with its devices for tenant "kuzzle"
    And I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 18          | 88.05306 |
      # Consumption is computed from the 2nd payload
      | "1"       | 18          | 87.89877 |
      | "1"       | 18          | 87.74043 |
      | "1"       | 19          | 87.59182 |
      | "1"       | 19          | 87.59182 |
      | "1"       | 19          | 87.43343 |
      | "1"       | 19          | 87.13422 |
      | "1"       | 19          | 86.98654 |
      | "1"       | 19          | 86.83773 |
      | "1"       | 19          | 86.68548 |
      | "1"       | 20          | 86.54444 |
      | "1"       | 20          | 86.39659 |
      | "1"       | 20          | 86.39659 |
    And I refresh the collection "tenant-hyvision-kuzzle":"measures"
    When I send the following "srett" payloads:
      | reference | temperature | pressure |
      | "1"       | 20          | 86.10420 |
    Then The document "tenant-hyvision-kuzzle":"assets":"H2Frame-H2-Cadre1" content match:
      | measures[1].type                 | "activeChannel" |
      | measures[1].values.activeChannel | "channel1"      |
