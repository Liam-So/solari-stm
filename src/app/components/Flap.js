import React from 'react'
import PropTypes from 'prop-types'

export const Flap = ({ bottom, animated, final, hinge, children }) => {
  const classes = `flap 
  ${bottom ? 'bottom' : 'top'} 
  ${animated ? 'animated' : ""} 
  ${final ? 'final' : ""}`.trim();

  return (
    <div className={classes}>
      {children}
      {hinge && <div className="hinge" data-kind='hinge' />}
    </div>
  );
}

Flap.defaultProps = {
  bottom: false,
  animated: false,
  final: false,
  hinge: false
}

Flap.propTypes = {
  bottom: PropTypes.bool,
  animated: PropTypes.bool,
  final: PropTypes.bool,
  hinge: PropTypes.bool
}