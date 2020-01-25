## 0.0.4
  - Add full path argument to those passed to notification callback.

## 0.0.3
  - Compare time based on their numeric value, a regular compare.

## 0.0.2
  - Prevent duplicate listeners from being added by expanding paths
  - Remove all listeners when we are closing to prevent duplicate events

## 0.0.1
  - Remove fs stat information from the callback, they are pointless as the file
    could already have changed when we emit this event.

## 0.0.0
  - Initial release \o/
