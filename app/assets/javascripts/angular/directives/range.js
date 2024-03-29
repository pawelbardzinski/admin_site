app.directive(
          "bnRange", ['$compile',
          function( $compile ) {
              // The range pattern allows for two number separated by 2 or 3 dots. Two
              // dot (ex, 1..10) indicates exclusive end while three dots (ex, 1...10)
              // indicates inclusive end.
              var rangePattern = /(-?\d+)(\.\.\.?)(-?\d+)/i;
              // I keep cached sets so that they don't have to be constructed over and
              // over again. Minor optimization.
              // --
              // NOTE: The sets are cached in serialized JSON format.
              var cachedSets = {};
              // Return the directive configuration. Since this directive compiles down
              // into a ngRepeat directive, we need to compile at 1001 - above the
              // ngRpeat priority (1000). Furthermore, we have to use terminal compiling
              // otherwise, the content will actually be compiled TWICE.
              return({
                  compile: compile,
                  priority: 1001,
                  restirct: "A",
                  terminal: true
              });
              // ---
              // PUBLIC METHODS.
              // ---
              // I compile the bnRange directive, replacing it with an ngRepeat
              // directive that can iterate over the generated range set.
              function compile( tElement, tAttributes ) {
                  var input = tAttributes.bnRange;
                  if ( missingRange( input ) ) {
                      throw( new Error( "Missing valid range in the form of M..N (exclusive) or M...N (inclusive)." ) );
                  }
                  // Add the ngRepeat directive that has consumes an array made up of
                  // the generated indices.
                  // --
                  // NOTE: We have to use $set() here, as opposed to .attr(), since the
                  // directives have already been collected for this element. As such,
                  // we have to explicitly let AngularJS know that new directives have
                  // been added.
                  tAttributes.$set(
                      "ngRepeat",
                      input.replace( rangePattern, replacePatternWithSet )
                  );
                  // Remove the bnRange directive from the markup (to make things look
                  // a little it nicer).
                  tAttributes.$set( tAttributes.$attr.bnRange, null );
                  // Return the linking function to complete the compilation of the
                  // ngRepeat directive we just injected.
                  return( link );
              }
              // I link the JavaScript events to the local scope.
              function link( scope, element, attributes ) {
                  // Once we have injected the ngRepeat directive, we have to make sure
                  // that is compiles and links. Since the bnRange directive executes at
                  // priority 1001, we want to continue the compilation at directives
                  // that execute below 1001 (ie, the ngRepeat).
                  $compile( element, null, 1001 )( scope );
              }
              // ---
              // PRIVATE METHODS.
              // ---
              // I build a set whose values are an ordered collection of the indices
              // required to iterate over FROM->TO. If the set is exclusive, the last
              // value in the set is excluded.
              function buildSet( from, to, isExclusive ) {
                  var set = [];
                  // Incrementing range.
                  if ( from <= to ) {
                      for ( var i = from ; i <= to ; i++ ) {
                          set.push( i );
                      }
                  // Decrementing range.
                  } else {
                      for ( var i = from ; i >= to ; i-- ) {
                          set.push( i );
                      }
                  }
                  if ( isExclusive ) {
                      set.pop();
                  }
                  return( set );
              }
              // I check to see if the directive input is missing a valid range (ex, M..N).
              function missingRange( input ) {
                  return( String( input ).search( rangePattern ) === -1 );
              }
              // I replace the matched range with a serialized set of indices.
              function replacePatternWithSet( range, start, operator, end ) {
                  // If this range has been parsed before, just return the cached set.
                  if ( cachedSets[ range ] ) {
                      return( cachedSets[ range ] );
                  }
                  var from = parseInt( start, 10 );
                  var to = parseInt( end, 10 );
                  var isExclusive = ( operator === ".." );
                  var set = buildSet( from, to, isExclusive );
                  // Once we have the set, serialize it into something that the
                  // ngRepeat directive can use, cache it, and return it.
                  return( cachedSets[ range ] = angular.toJson( set ) );
              }
          }
      ]);

