import React, { PropTypes } from 'react';
import { ControlLabel } from 'react-bootstrap';
import classNames from 'classnames';

export default function ShortcutsTable({ shortcuts, headerTitles, renderRow, className }) {
  const tableClassNames = classNames('shortcuts-table', className);

  return (
    <div>
      <table className={tableClassNames}>
        <thead>
          <tr>
            {headerTitles.map(title => (
              <th><ControlLabel>{title}</ControlLabel></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shortcuts.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}

ShortcutsTable.propTypes = {
  shortcuts: PropTypes.arrayOf(PropTypes.object),
  headerTitles: PropTypes.arrayOf(PropTypes.string),
  renderRow: PropTypes.func,
  className: PropTypes.string,
};
