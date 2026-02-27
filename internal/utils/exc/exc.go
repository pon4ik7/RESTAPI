package exc

import (
	"errors"
	"fmt"
	"time"
)

var StartTime time.Time

var (
	ErrMalformedParams = errors.New("malformed parameters")
	ErrMissingParams   = errors.New("missing parameters")
	ErrMalformedBody   = errors.New("malformed request body")
	ErrMissingBody     = errors.New("missing request body")
	ErrConflict        = errors.New("conflict")
	ErrNotFound        = errors.New("not found")
	ErrValidation      = errors.New("validation error")
	ErrInternal        = errors.New("internal error")
)

func Wrap(err error, format string, args ...any) error {
	return fmt.Errorf("%w: %s", err, fmt.Sprintf(format, args...))
}
